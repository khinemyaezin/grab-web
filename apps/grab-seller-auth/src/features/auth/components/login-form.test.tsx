import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { LoginForm } from './login-form';
import { useLoginMutation } from '../hooks/use-auth';

vi.mock('../hooks/use-auth', () => ({
  useLoginMutation: vi.fn(),
}));

vi.mock('@khinemyaezin/seller-api', () => ({
  eventBus: {
    publish: vi.fn(),
  },
}));

vi.mock('@khinemyaezin/seller-ui/components/field', () => ({
  FieldGroup: ({ children }: any) => <div>{children}</div>,
  Field: ({ children }: any) => <div>{children}</div>,
  FieldLabel: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>,
  FieldError: () => <div />,
  FieldDescription: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@khinemyaezin/seller-ui/components/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock('@khinemyaezin/seller-ui/components/button', () => ({
  Button: (props: any) => <button {...props} />,
}));

vi.mock('@khinemyaezin/seller-ui/components/index', () => ({
  ButtonStatus: ({ children }: any) => <div>{children}</div>,
}));

describe('LoginForm', () => {
  const mockMutate = vi.fn();
  const mockLink = { href: '/api/v1/auth/login', rel: 'login', method: 'POST' };

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useLoginMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('calls the login mutation with correct payload and publishes success event', async () => {
    mockMutate.mockImplementation((payload, options) => {
      options.onSuccess({ userId: 'user-123' });
    });

    render(
      <MemoryRouter>
        <LoginForm link={mockLink} onLoginSuccess={()=>{}} onLoginError={()=>{}} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'password123' } 
    });
    
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { 
          link: mockLink, 
          request: { email: 'test@example.com', password: 'password123' } 
        },
        expect.any(Object)
      );
    });

  });
});
