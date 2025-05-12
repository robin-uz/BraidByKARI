import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' })
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
      
      // Reset form
      reset();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-white font-medium">
            Name <span className="text-amber-500">*</span>
          </label>
          <input
            id="name"
            {...register('name')}
            className={`w-full bg-black/20 text-white border ${
              errors.name ? 'border-red-500' : 'border-white/20'
            } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#d9a43b]`}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-white font-medium">
            Email <span className="text-amber-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full bg-black/20 text-white border ${
              errors.email ? 'border-red-500' : 'border-white/20'
            } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#d9a43b]`}
            placeholder="Your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Subject Field */}
      <div className="space-y-2">
        <label htmlFor="subject" className="block text-white font-medium">
          Subject <span className="text-amber-500">*</span>
        </label>
        <input
          id="subject"
          {...register('subject')}
          className={`w-full bg-black/20 text-white border ${
            errors.subject ? 'border-red-500' : 'border-white/20'
          } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#d9a43b]`}
          placeholder="What is your message about?"
        />
        {errors.subject && (
          <p className="text-red-500 text-sm">{errors.subject.message}</p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-white font-medium">
          Message <span className="text-amber-500">*</span>
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={6}
          className={`w-full bg-black/20 text-white border ${
            errors.message ? 'border-red-500' : 'border-white/20'
          } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#d9a43b] resize-none`}
          placeholder="Your message here..."
        />
        {errors.message && (
          <p className="text-red-500 text-sm">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex justify-center sm:justify-end"
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md font-medium text-base min-w-[150px] h-[50px] shadow-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
              Sending...
            </div>
          ) : (
            'Send Message'
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default ContactForm;