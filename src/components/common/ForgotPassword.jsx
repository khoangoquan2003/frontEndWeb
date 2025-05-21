import React, { useState } from "react";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Gửi request đến server (API xử lý quên mật khẩu)
        console.log("Email submitted:", email);

        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Quên mật khẩu
                </h2>
                {submitted ? (
                    <p className="text-green-600 text-center">
                        Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label className="block text-gray-700 mb-2" htmlFor="email">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                        />
                        <div className="flex mt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                            >
                                Submit
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
