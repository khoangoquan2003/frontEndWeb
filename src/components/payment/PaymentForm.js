"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { http } from "../../api/Http" // Import axios hoặc http instance của bạn

const PaymentForm = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const amount = 50000 // Số tiền thanh toán cố định

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setError("") // Reset lỗi trước đó

        try {
            const userId = localStorage.getItem("userId") || "guest_user" // Cung cấp giá trị mặc định nếu userId là null

            // Gọi API tạo thanh toán (giả sử API của bạn sử dụng axios/http)
            const response = await http.get(`/api/payment/create-payment`, {
                params: {
                    amount: amount,
                    userId: userId,
                }
            })

            // Kiểm tra nếu phản hồi thành công
            if (response.status === 200) {
                const paymentUrl = response.data // Giả sử URL thanh toán được trả về trong phản hồi
                window.location.href = paymentUrl // Điều hướng đến VNPay
            } else {
                throw new Error("Tạo liên kết thanh toán không thành công.")
            }
        } catch (err) {
            console.error("Lỗi thanh toán:", err)
            setError("Đã xảy ra lỗi, vui lòng thử lại!") // Hiển thị thông báo lỗi
        } finally {
            setLoading(false) // Reset trạng thái loading
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-teal-50 to-teal-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-teal-600">Thanh Toán</h2>
                    <p className="text-gray-600">Hoàn tất thanh toán bảo mật của bạn.</p>
                </div>

                {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <Label htmlFor="amount" className="block text-lg font-medium text-gray-700 mb-2">
                            Số Tiền Thanh Toán (VND)
                        </Label>
                        <Input
                            type="text"
                            id="amount"
                            name="amount"
                            value={amount.toLocaleString("vi-VN")} // Định dạng để dễ đọc hơn
                            readOnly
                            disabled
                            className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <div className="text-center">
                        <Button
                            type="submit"
                            className={`w-full p-4 rounded-lg bg-teal-600 text-white font-semibold shadow-md hover:bg-teal-700 transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={loading}
                        >
                            {loading ? "Đang tạo liên kết thanh toán..." : "Thanh Toán"}
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-6 text-sm text-gray-500">
                    Bằng việc nhấp vào "Tiến hành thanh toán", bạn đồng ý với các điều khoản và điều kiện của chúng tôi.
                </div>
            </div>
        </div>
    )
}

export default PaymentForm
