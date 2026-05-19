import z from "zod";

// register user schema
export const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['CUSTOMER', 'ADMIN']).default('CUSTOMER'),
});

// register user type
export type registerSchemaType = z.infer<typeof registerSchema>;

// login details schema
export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password is required"),
});

// login details type
export type loginSchemaType = z.infer<typeof loginSchema>;

// verify email schema
export const verifyEmailSchema = z.object({
    email: z.email("Invalid email address"),
    code: z
      .string()
      .length(6, "Verification code must be 6 digits")
      .regex(/^\d+$/, "Verification code must contain only numbers"),
});

// verify email type
export type verifyEmailSchemaType = z.infer<typeof verifyEmailSchema>;

// -----------

const forgotPasswordSchema = z.email("Email should be valid");

const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(6, "The password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password don't match",
    path: ["confirmNewPassword"], //Sets the error on the confirmPassword field
  });

export const AuthValidation = {
  loginSchema,
  registerSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  changePasswordSchema,
};
