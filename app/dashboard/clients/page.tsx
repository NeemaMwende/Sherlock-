"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Client = {
  id: number;
  full_name: string;
  email: string;
  active_cases: number;
  created_at: string;
  days_ago: number;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    active_cases: "",
  });

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (mounted) setClients(data);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        active_cases: Number(form.active_cases),
      }),
    });

    setForm({ full_name: "", email: "", active_cases: "" });
    setLoading(false);
    fetchClients();
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Register Client */}
      <Card className="border-black flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-xl">Register New Client</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <Label>Full Name</Label>
              <Input
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Active Cases</Label>
              <Input
                type="number"
                value={form.active_cases}
                onChange={(e) =>
                  setForm({ ...form, active_cases: e.target.value })
                }
                required
              />
            </div>

            <div className="md:col-span-3">
              <Button
                type="submit"
                disabled={loading}
                className="bg-black text-white hover:bg-gray-800"
              >
                {loading ? "Registering..." : "Register Client"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="border-black flex-1 flex flex-col overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="text-xl">Clients</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Active Cases</TableHead>
                  <TableHead>Registered</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.full_name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.active_cases}</TableCell>
                    <TableCell>
                      {client.days_ago === 0
                        ? "Today"
                        : `${client.days_ago} day${client.days_ago > 1 ? "s" : ""} ago`}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
