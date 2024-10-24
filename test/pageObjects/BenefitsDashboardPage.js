export default class BenefitsDashboardPage {

    constructor(page) {
        this.page = page;
        this.addEmployeeButton = page.getByRole('button', { name: 'Add Employee' })
        this.logOutButton = page.getByRole('link', { name: 'Log Out' });
        this.addEmployeeModal = page.locator('id=employeeModal');
        this.employeesTable = page.locator('id=employeesTable');
    }

    async logOut () {
        await this.logOutButton.click();
    }

    async getRow(page, firstName) {
        const row = page.locator(`tr:has-text('${firstName}')`);
        return (await row.innerText()).split('\t');
    }
};