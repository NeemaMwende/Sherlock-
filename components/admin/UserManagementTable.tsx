// components/admin/UserManagementTable.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRow } from "@/types/db";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import AddUserDialog from "./AddUserDialog";

interface UserManagementTableProps {
  users: UserRow[];
}

export default function UserManagementTable({
  users: initialUsers,
}: UserManagementTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserRow | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleUserUpdated = (updatedUser: UserRow) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handleUserDeleted = (userId: number) => {
    setUsers(users.filter((u) => u.id !== userId));
  };

  const handleUserAdded = (newUser: UserRow) => {
    setUsers([newUser, ...users]);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all users</CardDescription>
            </div>
            <Button onClick={() => setIsAddingUser(true)}>Add User</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeletingUser(user)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onUserDeleted={handleUserDeleted}
        />
      )}

      {isAddingUser && (
        <AddUserDialog
          onClose={() => setIsAddingUser(false)}
          onUserAdded={handleUserAdded}
        />
      )}
    </>
  );
}
