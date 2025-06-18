"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Upload, Loader2, Crown, User, Edit } from "lucide-react"

export function EditUserForm({
                                 open,
                                 onOpenChange,
                                 formData,
                                 onFormDataChange,
                                 onSave,
                                 saving,
                             }) {
    const getInitials = (username) => {
        return username
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Edit className="h-5 w-5 mr-2 text-blue-500" />
                        {formData.id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Avatar Preview */}
                    <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={formData.avatarPreview || "/placeholder.svg"} alt="Avatar preview" />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg">
                                {formData.username ? getInitials(formData.username) : "?"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="w-full">
                            <Label htmlFor="avatar">Avatar</Label>
                            <div className="mt-1 flex items-center space-x-2">
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            onFormDataChange({
                                                ...formData,
                                                avatarFile: file,
                                                avatarPreview: URL.createObjectURL(file),
                                            })
                                        }
                                    }}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById("avatar")?.click()}
                                    className="w-full"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Chọn ảnh
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="username">Tên người dùng</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => onFormDataChange({ ...formData, username: e.target.value })}
                                placeholder="Nhập tên người dùng"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
                                placeholder="Nhập địa chỉ email"
                            />
                        </div>

                        <div>
                            <Label htmlFor="role">Vai trò</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => onFormDataChange({ ...formData, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Admin">
                                        <div className="flex items-center">
                                            <Crown className="h-4 w-4 mr-2" />
                                            Admin
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="User">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 mr-2" />
                                            User
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={onSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            "Lưu thay đổi"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
