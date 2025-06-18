"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Users, Edit, Trash2, UserCheck, Mail, User, Crown, Loader2, Search, Filter } from "lucide-react"
import { http } from "../api/Http"
import { EditUserForm } from "../admin-form/EditUserForm"
import { DeleteUserDialog } from "../admin-form/DeleteUserDialog"

export default function UserManagement() {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [saving, setSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [deleteUserId, setDeleteUserId] = useState(null)

    const [formData, setFormData] = useState({
        id: null,
        username: "",
        email: "",
        role: "",
        avatarFile: null,
        avatarPreview: "",
    })

    const currentUserId = Number.parseInt(localStorage.getItem("userId") || "0")

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, searchTerm, roleFilter])

    const filterUsers = () => {
        let filtered = users

        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        if (roleFilter !== "all") {
            filtered = filtered.filter((user) => user.role.toLowerCase() === roleFilter.toLowerCase())
        }

        setFilteredUsers(filtered)
    }

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const response = await http.get("/api/get-all-user")
            if (response.data.code === 200) {
                const mappedUsers = response.data.result.map((user) => ({
                    id: user.id,
                    username: user.userName || "N/A",
                    email: user.gmail || "N/A",
                    role: user.roles?.[0] || "User",
                    img: user.img || "",
                }))
                setUsers(mappedUsers)
            }
        } catch (error) {
            console.error("Error fetching users:", error)
            alert("Failed to fetch users!")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            id: null,
            username: "",
            email: "",
            role: "",
            avatarFile: null,
            avatarPreview: "",
        })
        setShowForm(false)
    }

    const handleSaveUser = async () => {
        const { id, username, email, role, avatarFile } = formData

        if (!username || !email || !role) {
            alert("Please fill all fields!")
            return
        }

        setSaving(true)
        try {
            const formDataToSend = new FormData()

            const data = {
                userId: id,
                userName: username,
                gmail: email,
                role: role.toUpperCase(),
            }

            formDataToSend.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }))

            if (avatarFile) {
                formDataToSend.append("avatar", avatarFile)
            }

            const response = await http.put("/api/edit-user", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (response.data.code === 200) {
                alert("User updated successfully!")

                const updatedUser = response.data.result
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === updatedUser.id
                            ? {
                                id: updatedUser.id,
                                username: updatedUser.userName,
                                email: updatedUser.gmail || "N/A",
                                role: updatedUser.roles?.[0] || "USER",
                                img: updatedUser.img || "",
                            }
                            : user,
                    ),
                )
                resetForm()
            } else {
                alert("Failed to update user")
            }
        } catch (error) {
            console.error("Error updating user:", error)
            alert("Error updating user")
        } finally {
            setSaving(false)
        }
    }

    const handleEditUser = (id) => {
        const user = users.find((u) => u.id === id)
        if (user) {
            setFormData({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatarFile: null,
                avatarPreview: user.img,
            })
            setShowForm(true)
        }
    }

    const handleDeleteUser = async () => {
        if (!deleteUserId) return

        try {
            await http.delete("/api/delete-user", { params: { userId: deleteUserId } })
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteUserId))
            alert("User deleted successfully!")
        } catch (error) {
            console.error("Failed to delete user:", error)
            alert("Error deleting user.")
        } finally {
            setDeleteUserId(null)
        }
    }

    const getRoleIcon = (role) => {
        switch (role.toLowerCase()) {
            case "admin":
                return <Crown className="h-4 w-4" />
            case "user":
                return <User className="h-4 w-4" />
            default:
                return <UserCheck className="h-4 w-4" />
        }
    }

    const getRoleBadgeVariant = (role) => {
        switch (role.toLowerCase()) {
            case "admin":
                return "bg-red-100 text-red-800 hover:bg-red-200"
            case "user":
                return "bg-blue-100 text-blue-800 hover:bg-blue-200"
            default:
                return "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }
    }

    const getInitials = (username) => {
        return username
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const userStats = {
        total: users.length,
        admins: users.filter((u) => u.role.toLowerCase() === "admin").length,
        users: users.filter((u) => u.role.toLowerCase() === "user").length,
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6" style={{ marginLeft: "16rem" }}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-600">Quản lý người dùng và phân quyền hệ thống</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Tổng người dùng</p>
                                <p className="text-2xl font-bold text-blue-900">{userStats.total}</p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-gradient-to-r from-red-50 to-red-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-600 text-sm font-medium">Quản trị viên</p>
                                <p className="text-2xl font-bold text-red-900">{userStats.admins}</p>
                            </div>
                            <Crown className="h-8 w-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-md bg-gradient-to-r from-green-50 to-green-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Người dùng</p>
                                <p className="text-2xl font-bold text-green-900">{userStats.users}</p>
                            </div>
                            <User className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6 border-0 shadow-md">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Tìm kiếm theo tên hoặc email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger>
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Lọc theo vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả vai trò</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* User Table */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-blue-500" />
                        Danh sách người dùng ({filteredUsers.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <span className="ml-2 text-gray-600">Đang tải danh sách người dùng...</span>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Avatar</TableHead>
                                    <TableHead>Tên người dùng</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Vai trò</TableHead>
                                    <TableHead className="text-right">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={user.img || "/placeholder.svg"} alt={user.username} />
                                                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                                        {getInitials(user.username)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-gray-900">{user.username}</div>
                                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                                    {user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getRoleBadgeVariant(user.role)} flex items-center w-fit`}>
                                                    {getRoleIcon(user.role)}
                                                    <span className="ml-1">{user.role}</span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEditUser(user.id)}
                                                        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Sửa
                                                    </Button>
                                                    {user.id !== currentUserId && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setDeleteUserId(user.id)}
                                                            className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Xóa
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-12">
                                            <div className="flex flex-col items-center">
                                                <Users className="h-12 w-12 text-gray-400 mb-4" />
                                                <p className="text-gray-500">Không tìm thấy người dùng nào</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Edit User Form */}
            <EditUserForm
                open={showForm}
                onOpenChange={setShowForm}
                formData={formData}
                onFormDataChange={setFormData}
                onSave={handleSaveUser}
                saving={saving}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteUserDialog
                open={!!deleteUserId}
                onOpenChange={(open) => !open && setDeleteUserId(null)}
                onConfirm={handleDeleteUser}
            />
        </div>
    )
}
