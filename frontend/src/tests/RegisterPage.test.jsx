import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from "../pages/Register"; 
import { BrowserRouter } from 'react-router-dom';

describe('RegisterPage', () => {
  test('renders register form', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('allows user to type in email and password', async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, 'newuser@example.com');
    await userEvent.type(passwordInput, 'mypassword');

    expect(emailInput).toHaveValue('newuser@example.com');
    expect(passwordInput).toHaveValue('mypassword');
  });
});
