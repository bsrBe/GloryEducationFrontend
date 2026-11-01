// Accounts are created at the end of the application, so there is one way to sign up.
import { redirect } from 'next/navigation';

export default function RegisterPage() {
  redirect('/apply/profile');
}
