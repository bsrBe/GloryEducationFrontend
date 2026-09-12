'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { authAPI, usersAPI, studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Input, Button } from '@/components/ui';
import { Eye, EyeOff, Shield, Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  // Password change state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

  // Account deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordForm>();

  const newPassword = watchPassword('newPassword');

  const onPasswordSubmit = async (data: ChangePasswordForm) => {
    setPasswordLoading(true);
    setPasswordMessage(null);

    try {
      await authAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      setPasswordMessage({
        type: 'success',
        text: 'Password changed successfully! You can continue using your account with the new password.',
      });
      
      resetPassword();
    } catch (error: any) {
      setPasswordMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password. Please check your current password.',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setDeleteMessage({
        type: 'error',
        text: 'Please type "DELETE MY ACCOUNT" exactly as shown to confirm.',
      });
      return;
    }

    setDeleteLoading(true);
    setDeleteMessage(null);

    try {
      if (user?.role === 'student') {
        await studentsAPI.deleteSelf();
      } else {
        await usersAPI.deleteSelf();
      }
      
      setDeleteMessage({
        type: 'success',
        text: 'Account deactivated successfully. You will be logged out shortly.',
      });

      // Log out after 3 seconds
      setTimeout(() => {
        logout();
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setDeleteMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to deactivate account. Please try again or contact support.',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-carbon">Account Settings</h1>
        <p className="text-dim-grey text-sm mt-1">
          Manage your account security and preferences
        </p>
      </div>

      {/* Change Password Section */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-ocean-light/20 flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-ocean" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-carbon mb-2">Change Password</h2>
            <p className="text-sm text-dim-grey mb-4">
              Update your password to keep your account secure. Make sure to use a strong, unique password.
            </p>

            {passwordMessage && (
              <div className={`px-4 py-3 rounded-lg text-sm font-medium mb-4 flex items-center gap-2 ${
                passwordMessage.type === 'success'
                  ? 'bg-green-bg border border-green/30 text-green-text'
                  : 'bg-red-bg border border-red/30 text-red-text'
              }`}>
                {passwordMessage.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  error={passwordErrors.currentPassword?.message}
                  className="pr-11"
                  {...registerPassword('currentPassword', {
                    required: 'Current password is required',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-[38px] text-dim-grey hover:text-carbon cursor-pointer"
                  title={showCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter a new password"
                  error={passwordErrors.newPassword?.message}
                  className="pr-11"
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-[38px] text-dim-grey hover:text-carbon cursor-pointer"
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  error={passwordErrors.confirmPassword?.message}
                  className="pr-11"
                  {...registerPassword('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: value =>
                      value === newPassword || 'Passwords do not match',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-[38px] text-dim-grey hover:text-carbon cursor-pointer"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" loading={passwordLoading}>
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>

      {/* Account Deletion Section */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-bg flex items-center justify-center flex-shrink-0">
            <Trash2 size={20} className="text-red" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-carbon mb-2">Deactivate Account</h2>
            <p className="text-sm text-dim-grey mb-4">
              Permanently deactivate your account. This action will disable your login but preserve your data for administrative purposes.
            </p>

            {deleteMessage && (
              <div className={`px-4 py-3 rounded-lg text-sm font-medium mb-4 flex items-center gap-2 ${
                deleteMessage.type === 'success'
                  ? 'bg-green-bg border border-green/30 text-green-text'
                  : 'bg-red-bg border border-red/30 text-red-text'
              }`}>
                {deleteMessage.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {deleteMessage.text}
              </div>
            )}

            {!showDeleteConfirm ? (
              <div className="bg-red-bg/30 border border-red/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red mb-2">Before you proceed:</h3>
                    <ul className="text-sm text-dim-grey space-y-1 mb-4">
                      <li>• Your account will be deactivated, not permanently deleted</li>
                      <li>• You will lose access to all features and data</li>
                      <li>• Your data will be preserved for administrative purposes</li>
                      <li>• Contact support if you want to reactivate your account later</li>
                    </ul>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      I understand, proceed with deactivation
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-bg/30 border border-red/20 rounded-lg p-4">
                  <p className="text-sm text-red font-medium mb-3">
                    Type <code className="bg-red/20 px-2 py-1 rounded font-mono">DELETE MY ACCOUNT</code> to confirm account deactivation:
                  </p>
                  <Input
                    placeholder="DELETE MY ACCOUNT"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="mb-3"
                  />
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                        setDeleteMessage(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={deleteLoading}
                      onClick={handleDeleteAccount}
                    >
                      Deactivate My Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}