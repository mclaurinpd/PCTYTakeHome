export default class AddEmployeeModal {

    constructor(page) {
        this.page = page;
        this.firstNameTextBox = page.locator('id=firstName');
        this.lastNameTextBox = page.locator('id=lastName');
        this.dependentsTextBox = page.locator('id=dependants');
        this.addEmployeeButton = page.locator('id=addEmployee');
    }

    async fillEmployeeModal (data) {
        await this.firstNameTextBox.fill(data.firstName);
        await this.lastNameTextBox.fill(data.lastName);
        await this.dependentsTextBox.fill(data.dependents);
        await this.addEmployeeButton.click();
    }
};