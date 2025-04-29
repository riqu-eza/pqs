import { redirect } from 'next/navigation';

export default function ProfileRedirect() {
  redirect('/profile/history'); // or /profile/account or any default
}
