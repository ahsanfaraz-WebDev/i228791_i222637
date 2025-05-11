import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import PageHeader from "../../components/ui/PageHeader";
import { User, Mail, Lock, Save } from "lucide-react";

interface ProfileFormInputs {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ProfilePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateUser } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors },
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    try {
      setIsSubmitting(true);
      
      // If new password is provided, update password as well
      if (data.newPassword) {
        if (!data.currentPassword) {
          toast.error("Current password is required to set a new password.");
          setIsSubmitting(false);
          return;
        }
        
        await axios.put("/api/users/password", {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
      }
      
      // Update profile
      const response = await axios.put("/api/users/profile", {
        name: data.name,
        email: data.email,
      });
      
      // Update local user state
      updateUser({
        ...user!,
        name: response.data.name,
        email: response.data.email,
      });
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Profile Settings" 
        subtitle="Manage your account information and password"
        backgroundImage="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />
      
      <section className="py-12">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="name"
                        type="text"
                        {...register("name", { required: "Name is required" })}
                        className="input pl-10"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className="input pl-10"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="currentPassword"
                        type="password"
                        {...register("currentPassword")}
                        className="input pl-10"
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="newPassword"
                        type="password"
                        {...register("newPassword", {
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        className="input pl-10"
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword", {
                          validate: (value) =>
                            !newPassword ||
                            value === newPassword ||
                            "Passwords do not match",
                        })}
                        className="input pl-10"
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      Saving changes...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </div>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
