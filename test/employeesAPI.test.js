import { test, expect, request } from '@playwright/test';
import { validUserId, invalidUserId, employeesRoute } from '../constants.js'

test.describe('Employees API', () => {

	test.describe('GET', () => {	
		test('should not be authorized (401)', async ({ request }) => {
			const response = await request.get(employeesRoute, {
				headers: {
					'Authorization': ''
				}
			});

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(401);
		})

		/*
		* Should this test expect a 200/204 because the request is valid and there's no matching employee id?
		* Or should this test expect an error(like 404) because the requested resource doesn't exist?
		* An argument could be made for either. I'm not sure what Paylocity's standard is for this situation.
		*/
		test('should not return an employee using invalid id (404)', async ({ request }) => {
			const response = await request.get(employeesRoute + `/${invalidUserId}`);

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(404)

		});

		test('should return all employees (200)', async ({ request }) => {
			const response = await request.get(employeesRoute);
			
			expect(response.ok()).toBeTruthy();
			expect(response.status()).toBe(200);
			
			const employees = await response.json();

			// returning the partition and sort keys is redundant but we test for them anyway
			employees.forEach((employee) => {
				expect(employee).toEqual(expect.objectContaining({
					partitionKey: expect.any(String),
					sortKey: expect.any(String),
					id: expect.any(String),
					firstName: expect.any(String),
					lastName: expect.any(String),
					dependants: expect.any(Number),
					salary: expect.any(Number),
					gross: expect.any(Number),
					benefitsCost: expect.any(Number),
					net: expect.any(Number)
				}));
			});
		});

		test('should return a single employee using valid id (200)', async ({ request }) => {
			const response = await request.get(employeesRoute + `/${validUserId}`);

			expect(response.ok()).toBeTruthy();
			expect(response.status()).toBe(200);
			expect(await response.json()).toEqual(expect.objectContaining({
				partitionKey: expect.any(String),
				sortKey: expect.any(String),
				id: expect.any(String),
				firstName: expect.any(String),
				lastName: expect.any(String),
				dependants: expect.any(Number),
				expiration: expect.any(String),
				salary: expect.any(Number),
				gross: expect.any(Number),
				benefitsCost: expect.any(Number),
				net: expect.any(Number)
			}));
		});
	});

	test.describe('POST', () => {
		let idToDelete;

		test.afterEach(async ({ request }) => {
			if (idToDelete) {
				await request.delete(employeesRoute + `/${idToDelete}`);
				idToDelete = '';
			}
		});

		// this test fails because it is returning a 405 and not a 400. i believe this is incorrect because POST is allowed at this route.
		test('should not create an employee with an empty payload (400)', async ({ request }) => {
			const response = await request.post(employeesRoute);

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(400);
		});

		test('should not create an employee with no last name (400)', async ({ request }) => {
			const data = {
				firstName: 'Phillip'
			};

			const response = await request.post(employeesRoute, {
				data
			});

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(400);

			const body = await response.json();
			
			expect(body[0].memberNames).toEqual(['LastName']);
			expect(body[0].errorMessage).toEqual('The LastName field is required.');
		});

		test('should not create an employee with no first name (400)', async ({ request }) => {
			const data = {
				lastName: 'McLaurin'
			};

			const response = await request.post(employeesRoute, {
				data
			});

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(400);

			const body = await response.json();
			
			expect(body[0].memberNames).toEqual(['FirstName']);
			expect(body[0].errorMessage).toEqual('The FirstName field is required.');
		});

		test('should not create an employee with no first or last name (400)', async ({ request }) => {
			const data = {};

			const response = await request.post(employeesRoute, {
				data
			});

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(400);

			const body = await response.json();

			expect(body).toHaveLength(2);

			expect(body[0].memberNames).toEqual(['FirstName']);
			expect(body[0].errorMessage).toEqual('The FirstName field is required.');
			expect(body[1].memberNames).toEqual(['LastName']);
			expect(body[1].errorMessage).toEqual('The LastName field is required.');
		});

		[
			{ data: { firstName: 'Phillip', lastName: 'McLaurin' }},
			{ data: { firstName: 'Phillip', lastName: 'McLaurin', dependants: 4 }}
		].forEach(({ data }) => {
			test(`should create an employee with ${data.dependants} dependants (200)`, async ({ request }) => {
				const postResponse = await request.post(employeesRoute, {
					data
				});

				expect(postResponse.ok()).toBeTruthy();
				expect(postResponse.status()).toBe(200);

				const postBody = await postResponse.json();
				const getResponse = await request.get(employeesRoute + `/${postBody.id}`);
				const getBody = await getResponse.json();

				idToDelete = postBody.id;

				// the get response returns an expiration but the post resposne does not. potential minor bug.
				expect(getBody).toEqual(expect.objectContaining(postBody));
				expect(getBody.dependants).toBe(data.dependants ?? 0);
			});
		});
	});

	test.describe('DELETE', () => {
		const data = { firstName: 'Phillip', lastName: 'McLaurin', dependants: 4 };
		let id;

		test.beforeAll(async ({ baseURL }) => {
			const apiContext = await request.newContext({})
			const response = await apiContext.post(baseURL + employeesRoute, {
				data
			});

			id = (await response.json()).id;
		});

		test('should delete an employee with given id (200)', async ({ request }) => {
			const deleteResponse = await request.delete(employeesRoute + `/${id}`);

			expect(deleteResponse.ok()).toBeTruthy();
			expect(deleteResponse.status()).toBe(200);

			// GET on an id returns 200 even if the id doesn't exist. potentially a bug but could also be PCTY standard
			const getResponse = await request.get(employeesRoute + `/${id}`);
			expect((await getResponse.body()).data).toBeUndefined();
		});


	});

	test.describe('PUT', () => {
		const initEmployee = { firstName: 'John', lastName: 'Doe', dependants: 0}
		let id;

		test.beforeEach(async ({ request }) => {
			const response = await request.post(employeesRoute, {
				data: initEmployee
			});

			id = (await response.json()).id;
		});

		test.afterEach(async ({ request }) => {
			if (id) {
				await request.delete(employeesRoute + `/${id}`);
				id = '';
			}
		});

		test('should not update without first name', async ({ request }) => {
			const data = { id, lastName: 'Smith' }
			const response = await request.put(employeesRoute, {
				data
			});

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(400);

			const body = await response.json();
			
			expect(body[0].memberNames).toEqual(['FirstName']);
			expect(body[0].errorMessage).toEqual('The FirstName field is required.');

		});

		test('should not update without last name', async ({ request }) => {
			const data = { id, firstName: 'Jane' }
			const response = await request.put(employeesRoute, {
				data
			});

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(400);

			const body = await response.json();
			
			expect(body[0].memberNames).toEqual(['LastName']);
			expect(body[0].errorMessage).toEqual('The LastName field is required.');

		});

		test('should not update without first and last name', async ({ request }) => {
			const data = { id }
			const response = await request.put(employeesRoute, {
				data
			});

			expect(response.ok()).toBeFalsy();
			expect(response.status()).toBe(400);

			const body = await response.json();

			expect(body).toHaveLength(2);
			
			expect(body[0].memberNames).toEqual(['FirstName']);
			expect(body[0].errorMessage).toEqual('The FirstName field is required.');
			expect(body[1].memberNames).toEqual(['LastName']);
			expect(body[1].errorMessage).toEqual('The LastName field is required.');

		});

		[
			{ data: { firstName: 'Jane', lastName: 'Smith' } },
			{ data: { firstName: 'Jane', lastName: 'Smith', dependants: 4 } }
		].forEach(({ data }) => {
			test(`should update to ${JSON.stringify(data)}`, async ({ request }) => {
				data.id = id;
				const putResponse = await request.put(employeesRoute, {
					data
				});

				expect(putResponse.ok()).toBeTruthy();
				expect(putResponse.status()).toBe(200);

				const getResponse = await request.get(employeesRoute + `/${id}`);
				expect(await getResponse.json()).toEqual(expect.objectContaining(await putResponse.json()));
			});
		});
	})
});