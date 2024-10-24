import { v4 as uuidv4 } from 'uuid';


// / / API ROUTES / / //
export const apiRoute = '/Prod/api'

export const employeesRoute = apiRoute + '/employees';

// / / UI ROUTES / / //
export const loginPage = '/Prod/Account/Login'

export const invalidUserId = uuidv4();
export const validUserId = '6ef80eaf-c6e5-4e20-8c91-573853294dcc';