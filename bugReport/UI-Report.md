# UI Bugs

### Description
The first and last names of employees are swapped in the UI.
### Steps to Reproduce
**Browser:** Firefox and Chrome
1. Login as an employer.
2. Look at employee names in the table and see that they are swapped. This can be validated by viewing the API call in the network tab to see that first and last name are not correctly displayed.
### Expected
First name to be in the first name column

Last name to be in the last name column
### Actual
First name is the last name column

Last name is the first name column
### Screenshot
[Click to view.](https://github.com/user-attachments/assets/fed3aaed-93db-4c88-a0fa-d21c060eae97)

---

### Description
The benefits dashboard is accessible without logging in.
### Steps to Reproduce
1. Make sure you are not logged in to the dashboard.
2. Go to this [link.](https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/Benefits)
### Expected
I shouldn't be able to see the dashboard without logging in. It should redirect to a login page if there is no authorization.
### Actual
I can see the dashboard with no entries in the table. A GET call is made to the employees endpoint and a 401 is returned.
### Screenshot
[Click to view](https://github.com/user-attachments/assets/7aa94040-af97-4747-9f4a-be1751e0e9e1)

---

### Description
The table border does not scale if the first and last name take up too much space.
### Steps to Reproduce
1. Login as an employer.
2. Add an employee and set the first and last name as strings that take up lots of space(capital w or capital m).
### Expected
The table border should resize if the table cells do. The border should remain around the outside.
### Actual
The table border does not resize. It appears to have static dimensions while the cells are resized dynamically.
### Screenshot
- [Click to view.](https://github.com/user-attachments/assets/2acbc082-54e2-49f3-9771-a8c34272d1cf)
- [Click to view alternate.](https://github.com/user-attachments/assets/3723fb3d-89af-44bd-98e2-a13b0fa25699)

---

### Description
Invalid username returns a 405, fails to reload the login page, and doesn't provide the user with any information as to why.
### Steps to Reproduce
1. Go to the login page.
2. Enter an invalid username and a random string for the password(can't be empty).
### Expected
The UI should reload and indicate to the user that their username or password is incorrect.
### Actual
The user is taken to a blank page or error page depending on their browser.
### Screenshot
* Chrome: [Click to view.](https://github.com/user-attachments/assets/aec321b1-29b5-402c-aca0-510168655a57)
* Firefox: [Click to view.](https://github.com/user-attachments/assets/a0600876-7005-45f5-9672-5b9535e803ed)
