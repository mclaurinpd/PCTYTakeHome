import { test, expect, request } from '@playwright/test';
import { v4 as uuidv4 } from 'uuid';

import DashboardLoginPage from './pageObjects/DashboardLoginPage';
import BenefitsDashboardPage from './pageObjects/BenefitsDashboardPage';
import AddEmployeeModal from './pageObjects/AddEmployeModal';
import { employeesRoute } from '../constants.js'

test.describe.configure({ mode: 'serial' });

test.describe('Dashboard UI', () => {
	let id;

	test.afterAll(async ({ request }) => {
		if (id) {
			const response = await request.delete(employeesRoute + `/${id}`);
		}

	});

	test('can log in', async ({ page }) => {
		const loginPage = new DashboardLoginPage(page);
		const dashboardPage = new BenefitsDashboardPage(page);

		await loginPage.goto();
		await loginPage.login();
	
		await expect(dashboardPage.logOutButton).toBeVisible();
	});

	test('can add an employee', async ({ page }) => {
		const loginPage = new DashboardLoginPage(page);
		const dashboardPage = new BenefitsDashboardPage(page);
		const addEmployeeModal = new AddEmployeeModal(page);

		const firstNameUUID = uuidv4();
		const data = {
			firstName: firstNameUUID,
			lastName: 'Doo',
			dependents: '4'
		}

		await loginPage.goto();
		await loginPage.login();

		await dashboardPage.addEmployeeButton.click();
		await addEmployeeModal.fillEmployeeModal(data);

		const row = await dashboardPage.getRow(page, firstNameUUID);
		id = row[0];

		expect(row).toEqual(
			expect.arrayContaining(Object.values(data))
		);
	})
})