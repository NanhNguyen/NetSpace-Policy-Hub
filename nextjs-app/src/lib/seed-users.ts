import { supabase } from "./db/client";

export const seedHRUser = async () => {
    const email = "hr@gmail.com";
    const password = "password123456"; // More than 6 chars is usually required

    // 1. Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: "HR Manager",
                role: "HR"
            }
        }
    });

    if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
            console.log("User already exists, attempting to ensure profile role is set.");
            // 2. Fetch the user to get ID
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (!signInError && signInData.user) {
                // 3. Update the profile role manually if triggers are missing
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ role: 'HR' })
                    .eq('id', signInData.user.id);

                if (updateError) console.error("Could not update profile role:", updateError);
                else console.log("Profile role set to HR successfully.");
            }
            return { success: true, message: "Tài khoản đã tồn tại và đã được cập nhật quyền HR." };
        }
        return { success: false, message: signUpError.message };
    }

    return { success: true, message: "Đã tạo tài khoản HR thành công! Hãy tải lại trang để đăng nhập." };
};
