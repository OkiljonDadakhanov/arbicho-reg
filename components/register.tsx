"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";
import logo from "@/public/logo/olympic.png";
import beruni from "@/public/logo/logo.png";
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

const baseUrl = "https://api.olympcentre.uz/";

// Define the available roles with correct values
const roleOptions = [
  { id: "1", value: "Team Leader", label: "Team Leader" },
  { id: "2", value: "Team Coordinator", label: "Team Coordinator" },
];

const formSchema = z.object({
  full_name: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters." }),
  country: z.string().min(1, { message: "Please select a country." }),
  role: z.string().min(1, { message: "Please select a role." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone_number: z.string().min(1, { message: "Please enter a valid phone number." }),
  students_coming: z
    .string()
    .min(1, { message: "Please select number of students." }),
});

const RegistrationForm: React.FC = () => {
  // Add client-side only rendering
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      country: "",
      role: "",
      email: "",
      phone_number: "",
      students_coming: "0",
    },
  });

  const [countries, setCountries] = useState<{ id: number; name: string }[]>(
    []
  );

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

    if (isClient) {
      fetchCountries();
    }
  }, [isClient]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Format data according to required submission format
      const formData = {
        full_name: values.full_name,
        country: parseInt(values.country), // Convert string to number
        role: values.role, // Send the actual role text
        email: values.email,
        phone_number: values.phone_number,
        students_coming: values.students_coming,
      };

      const res = await fetch(`${baseUrl}api/participation-requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        toast.success(
          "Thank you for your registration. You will receive a confirmation email from the organization shortly. Please allow a few moments for this correspondence to arrive."
        );
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

  const studentCounts = [
    { id: "0", value: "0", label: "0 student" },
    { id: "1", value: "1", label: "1 student" },
    { id: "2", value: "2", label: "2 students" },
    { id: "3", value: "3", label: "3 students" },
    { id: "4", value: "4", label: "4 students" },
  ];

  // Return early if not client-side yet
  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <Toaster />

      <div className="flex justify-between">
        <Image
          src={beruni}
          alt="beruni"
          width={100}
          height={100}
          className="object-contain"
        />
        <Image
          src={logo}
          alt="logo"
          width={150}
          height={150}
          className="object-contain"
        />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center mt-4">
        Registration Form for Abu Rayhan Biruni International Chemistry Olympiad
        2025
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
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.isArray(countries) &&
                      countries.map((country) => (
                        <SelectItem
                          key={country.id}
                          value={country.id.toString()}
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
                    {roleOptions.map((role) => (
                      <SelectItem key={role.id} value={role.value}>
                        {role.label}
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
            name="students_coming"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How many students are coming? </FormLabel>
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
                    {studentCounts.map((option) => (
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
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="934798949" {...field} />
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
    </div>
  );
};

export default RegistrationForm;