# API Bugs

### Description
Most invalid requests sent to the `/employees` endpoint return a 405 instead of error handling based on the HTTP method
### Steps to reproduce
1. Send a PUT request that's missing an id.

Or

1. Send an empty POST request
### Expected
The api should return a 400 bad request based on the HTTP method and why it's a bad request.
### Actual
The api returns a 405 method not allowed which is misleading since PUT, POST, and DELETE are valid methods for `/employees`
The header response says that GET is the only allowed method.
### Screenshot
[Click to view.](https://github.com/user-attachments/assets/acab6b63-024b-49e4-9fba-124ba8628e16)


---

### Description
Certain invalid tokens do not return a 401 unauthorized.
### Steps to reproduce
1. Remove a random character from the auth token.
2. Send a request.
### Expected
I should receive a 401 with an invalid token.
### Actual
I receive a 500 internal servor error
### Screenshot
[Click to view.](https://github.com/user-attachments/assets/b1a34a9a-ef9c-468b-b040-92c3a20231e0)

---

### Description
GET requests to `/employees/{id}` return a 500 and HTML response instead of JSON if the id's length is not equal to 36 characters.
### Steps to reproduce
1. Send a a request to `/employees/{id}` that isn't the standard UUID length (36 characters).
### Expected
I should receive either a 200 with an empty body or 404 with a JSON body indicating that there is no employee with the specified id.
### Actual
I receieve a 500 HTML response indicating that the server is not handling invalid ids correctly. The response is far too large and has more information than is necessary for the user.
### Screenshot
[Click to view.](https://github.com/user-attachments/assets/5a325f74-80cb-4767-9616-4f8518d0f0d3)

