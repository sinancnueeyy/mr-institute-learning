# Admin Setup Guide

This document explains how to set up the very first administrator accounts in the production environment. 

Due to our strict security rules, you cannot simply sign up from the UI to become an admin. You must manually assign the appropriate role using the Firebase Console or an initialization script for the very first user.

## 1. Creating the First Developer (Super Admin)

1. Navigate to your live production website and click on a login link (or go directly to `/login`).
2. Create a standard user account using an Email and Password.
3. Open the **Firebase Console**.
4. Go to **Firestore Database** > `users` collection.
5. Find the document that matches the UID of the account you just created.
6. Manually edit the document and set the `role` field (string) to exactly: `developer`.
7. Log out and log back into the application. 
8. You now have full access to the `/developer/*` routes.

## 2. Creating an Office Admin

The Developer CMS handles the creation and management of Office staff.
1. Log in with your `developer` account.
2. Navigate to the Developer Dashboard.
3. Use the user management interface (or invite system) to create an account for an office staff member.
4. The system will automatically assign the `officeAdmin` role to this user.
5. This user will now have restricted access to the `/office/*` routes, allowing them to manage applications, CRM data, and students, but preventing them from altering the website layout or system settings.

## 3. How Protection Works

- **Routing Level:** Our React application uses the `RoleRoute.tsx` component. If a user attempts to access `/developer/*` without the `developer` claim, they are instantly redirected to a `/unauthorized` page.
- **Database Level:** Even if a user bypasses the frontend router, `firestore.rules` guarantees that any write operation to CMS collections strictly requires `request.auth.token.role == 'developer'`.
