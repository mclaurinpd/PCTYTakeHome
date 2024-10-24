import { loginPage } from "../../constants";

export default class DashboardLoginPage {

	constructor(page) {
		this.page = page;
		this.userNameTextBox = page.locator('id=Username');
		this.passwordTextBox = page.locator('id=Password');
		this.loginButton = page.getByRole('button', { name: 'Log In' });
	}

	async goto() {
		await this.page.goto(process.env.BASE_URL + loginPage);
	}

	async login() {
		await this.userNameTextBox.fill(process.env.LOGIN);
		await this.passwordTextBox.fill(process.env.PASSWORD);
		await this.loginButton.click();
	}
};