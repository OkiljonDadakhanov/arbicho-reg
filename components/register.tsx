"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const baseUrl = process.env.API_BASE_URL;

const formSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  country: z.string().min(1, { message: "Please select a country." }),
  role: z.string().min(1, { message: "Please select a role." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  whatsapp_numer: z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message:
      "Please enter a valid WhatsApp number starting with + (e.g., +1234567890)",
  }),
  maths_students: z
    .string()
    .min(1, { message: "Please select number of math students." }),
  informatics_students: z
    .string()
    .min(1, { message: "Please select number of informatics students." }),
  maths_team_leaders: z
    .string()
    .min(1, { message: "Please select number of math team leaders." }),
  informatics_team_leaders: z
    .string()
    .min(1, { message: "Please select number of informatics team leaders." }),
});

const RegistrationForm: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      country: "",
      role: "",
      subject: "",
      email: "",
      whatsapp_numer: "",
      maths_students: "0",
      informatics_students: "0",
      maths_team_leaders: "0",
      informatics_team_leaders: "0",
    },
  });

  const [countries, setCountries] = useState<{ id: number; name: string }[]>(
    []
  );
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch(`${baseUrl}api/countries/`, {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch countries");
        const data = await res.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to load countries");
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch(`${baseUrl}api/roles/`, {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch roles");
        const data = await res.json();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles");
      }
    }
    fetchRoles();
  }, []);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await fetch(`${baseUrl}api/subjects/`, {
          method: "GET",
          headers: {
            Accept: "*/*",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = await res.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Failed to load subjects");
      }
    }
    fetchSubjects();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = {
        full_name: values.full_name,
        country: values.country,
        role: values.role,
        subject: values.subject,
        email: values.email,
        whatsapp_numer: values.whatsapp_numer,
        participants: {
          maths_students: values.maths_students,
          informatics_students: values.informatics_students,
          maths_team_leaders: values.maths_team_leaders,
          informatics_team_leaders: values.informatics_team_leaders,
        },
      };

      const res = await fetch(`${baseUrl}api/participation-requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Registration submitted successfully!");
        form.reset();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to submit registration.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting.");
      console.error(error);
    }
  }

  const studentCountsMaths = [
    { id: "0", value: "0", label: "0 student" },
    { id: "1", value: "1", label: "1 student" },
    { id: "2", value: "2", label: "2 students" },
    { id: "3", value: "3", label: "3 students" },
    { id: "4", value: "4", label: "4 students" },
  ];

  const studentCountsInfo = [
    { id: "0", value: "0", label: "0 student" },
    { id: "1", value: "1", label: "1 student" },
    { id: "2", value: "2", label: "2 students" },
  ];

  const teamLeaders = [
    { id: "0", value: "0", label: "0 team leader" },
    { id: "1", value: "1", label: "1 team leader" },
    { id: "2", value: "2", label: "2 team leaders" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8"
    >
      <Toaster />
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Registration Form
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.isArray(countries) &&
                      countries.map((country) => (
                        <SelectItem
                          key={country.id}
                          value={country?.id?.toString()}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role?.id?.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject?.id?.toString()}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maths_students"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How many students are coming? (Maths)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of students" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {studentCountsMaths.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="informatics_students"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  How many students are coming? (Informatics)
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of students" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {studentCountsInfo.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maths_team_leaders"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How many team leaders are coming? (Maths)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of team leaders" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teamLeaders.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="informatics_team_leaders"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  How many team leaders are coming? (Informatics)
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of team leaders" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teamLeaders.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp_numer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Submit Registration
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default RegistrationForm;
