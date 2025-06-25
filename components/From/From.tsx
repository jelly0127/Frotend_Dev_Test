'use client'
import React from 'react';
import { DynamicForm, FieldConfig } from '../ui/dynamic-form';
import { z } from 'zod';

const From = () => {
  // Define form field configurations
  const formFields: FieldConfig[] = [
    {
      name: 'username',
      type: 'text',
      label: 'Nickname',
      placeholder: 'Enter your nickname',
      required: true,
      description: 'Username must be unique'
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      required: true
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      required: true,
      validation: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase letters and numbers')
    },
    {
      name: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter your age',
      required: true,
      validation: z.coerce.number().min(18, 'Age must be greater than 18').max(100, 'Age cannot exceed 100')
    },
    {
      name: 'phone',
      type: 'tel',
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      required: false
    },
    {
      name: 'gender',
      type: 'select',
      label: 'Gender',
      required: true,
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
      ]
    },
    {
      name: 'hobbies',
      type: 'radio',
      label: 'Main Hobby',
      required: false,
      options: [
        { label: 'Reading', value: 'reading' },
        { label: 'Sports', value: 'sports' },
        { label: 'Music', value: 'music' },
        { label: 'Travel', value: 'travel' }
      ]
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Bio',
      placeholder: 'Tell us about yourself...',
      required: false,
      description: 'Maximum 200 characters'
    },
    {
      name: 'newsletter',
      type: 'checkbox',
      label: 'Subscribe to Newsletter',
      defaultValue: false,
      required: false
    },
    {
      name: 'birthdate',
      type: 'date',
      label: 'Birth Date',
      required: false
    }
  ];

  // Handle form submission
  const handleSubmit = async (data: Record<string, unknown>) => {
    console.log('Form data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Form submitted successfully!');
  };

  // Handle form errors
  const handleError = (errors: Record<string, unknown>) => {
    console.error('Form errors:', errors);
  };

  return (
    <div className="min-h-screen  h-full py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Dynamic Form Demo
            </h1>
            <p className="text-gray-300">
              This is a demonstration of a reusable form component with dynamic field configuration
            </p>
          </div>

          <DynamicForm
            fields={formFields}
            submitButtonText="Submit Form"
            formClassName="space-y-6"
            onSubmit={handleSubmit}
            onError={handleError}
          />

        </div>
      </div>
    </div>
  );
};

export default From;