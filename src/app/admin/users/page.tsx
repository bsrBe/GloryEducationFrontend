'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usersAPI } from '@/lib/api';
import { Card, Button, Input, Select, Badge, LoadingSpinner, ErrorState } from '@/components/ui';
import { Plus, Trash2, UserCheck, X } from 'lucide-react';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  createdAt: string;
}

interface CreateUserForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserForm>();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await usersAPI.list();
      setUsers(res.data);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load users'
      );
    } finally {
      setLoading(false);
    }
  };

  const onCreate = async (data: CreateUserForm) => {
    setCreating(true);
    try {
      await usersAPI.create(data as unknown as Record<string, unknown>);
      reset();
      setShowForm(false);
      loadUsers();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create user'
      );
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await usersAPI.remove(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      // error
    }
  };

  const roleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="red">Admin</Badge>;
      case 'glory_staff':
        return <Badge variant="blue">Glory Staff</Badge>;
      case 'university_rep':
        return <Badge variant="yellow">University Rep</Badge>;
      default:
        return <Badge variant="grey">{role}</Badge>;
    }
  };

  if (loading) return <LoadingSpinner text="Loading users..." />;
  if (error && !users.length) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-carbon">User Management</h1>
          <p className="text-dim-grey text-sm mt-1">Manage staff and representative accounts</p>
        </div>
        <Button variant="accent" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Create User
        </Button>
      </div>

      {showForm && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-carbon">New User</h3>
            <button onClick={() => setShowForm(false)} className="text-dim-grey hover:text-carbon">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" {...register('firstName', { required: true })} error={errors.firstName?.message} />
              <Input label="Last Name" {...register('lastName', { required: true })} error={errors.lastName?.message} />
            </div>
            <Input label="Email" type="email" {...register('email', { required: true })} error={errors.email?.message} />
            <Input label="Password" type="password" {...register('password', { required: true, minLength: { value: 6, message: 'Min 6 chars' } })} error={errors.password?.message} />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Role"
                options={[
                  { value: '', label: 'Select...' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'glory_staff', label: 'Glory Staff' },
                  { value: 'university_rep', label: 'University Rep' },
                ]}
                {...register('role', { required: true })}
                error={errors.role?.message}
              />
              <Input label="Phone (optional)" {...register('phone')} />
            </div>
            <Button type="submit" loading={creating}>Create User</Button>
          </form>
        </Card>
      )}

      <Card padding={false}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-charcoal/10">
              <th className="text-left px-6 py-3 text-xs font-semibold text-dim-grey uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-dim-grey uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-dim-grey uppercase">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-dim-grey uppercase">Created</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-dim-grey uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-charcoal/5 hover:bg-porcelain/50">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-ocean-light flex items-center justify-center text-ocean text-sm font-semibold">
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <span className="font-medium text-carbon text-sm">
                      {u.firstName} {u.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-dim-grey">{u.email}</td>
                <td className="px-6 py-3">{roleBadge(u.role)}</td>
                <td className="px-6 py-3 text-sm text-dim-grey">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => onDelete(u._id)}
                    className="p-1.5 text-dim-grey hover:text-red transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-8 text-dim-grey">
            <UserCheck size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No users yet. Create the first one!</p>
          </div>
        )}
      </Card>
    </div>
  );
}
