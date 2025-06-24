"use client"

import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export function SettingsPage() {
  const { t, direction } = useLanguage()

  // Organized translations by section
  const translations = {
    tabs: {
      profile: t("پروفائل"),
      account: t("اکاؤنٹ"),
      farmSettings: t("فارم کی ترتیبات"),
      notifications: t("اطلاعات")
    },
    profile: {
      title: t("پروفائل کی ترتیبات"),
      description: t("اپنی ذاتی معلومات کو اپ ڈیٹ کریں"),
      name: t("نام"),
      email: t("ای میل"),
      phone: t("فون"),
      saveChanges: t("تبدیلیاں محفوظ کریں")
    },
    account: {
      title: t("اکاؤنٹ کی ترتیبات"),
      description: t("اپنا اکاؤنٹ پاس ورڈ تبدیل کریں"),
      currentPassword: t("موجودہ پاس ورڈ"),
      newPassword: t("نیا پاس ورڈ"),
      confirmPassword: t("پاس ورڈ کی تصدیق کریں"),
      changePassword: t("پاس ورڈ تبدیل کریں")
    },
    farm: {
      title: t("فارم کی ترتیبات"),
      description: t("اپنے فارم کی معلومات کا نظم کریں"),
      farmName: t("فارم کا نام"),
      farmLocation: t("فارم کا مقام"),
      farmSize: t("فارم کا سائز (ایکڑ)"),
      saveChanges: t("تبدیلیاں محفوظ کریں")
    },
    notifications: {
      title: t("اطلاعات کی ترتیبات"),
      description: t("ترتیب دیں کہ آپ کو اطلاعات کیسے موصول ہوں گی"),
      email: {
        label: t("ای میل اطلاعات"),
        description: t("ای میل کے ذریعے اطلاعات موصول کریں")
      },
      sms: {
        label: t("ایس ایم ایس اطلاعات"),
        description: t("ایس ایم ایس کے ذریعے اطلاعات موصول کریں")
      },
      healthAlerts: {
        label: t("صحت کے انتباہات"),
        description: t("مویشیوں کی صحت کے مسائل کے بارے میں انتباہات حاصل کریں")
      },
      saveChanges: t("تبدیلیاں محفوظ کریں")
    }
  }

  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList>
        <TabsTrigger value="profile">{translations.tabs.profile}</TabsTrigger>
        <TabsTrigger value="account">{translations.tabs.account}</TabsTrigger>
        <TabsTrigger value="farm">{translations.tabs.farmSettings}</TabsTrigger>
        <TabsTrigger value="notifications">{translations.tabs.notifications}</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{translations.profile.title}</CardTitle>
            <CardDescription>{translations.profile.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{translations.profile.name}</Label>
              <Input
                id="name"
                defaultValue="Muhammad Hanzala"
                className={direction === "rtl" ? "text-right" : "text-left"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{translations.profile.email}</Label>
              <Input
                id="email"
                type="email"
                defaultValue="john.doe@example.com"
                className={direction === "rtl" ? "text-right" : "text-left"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{translations.profile.phone}</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue="3227064186"
                className={direction === "rtl" ? "text-right" : "text-left"}
              />
            </div>
            <Button>{translations.profile.saveChanges}</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="account" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{translations.account.title}</CardTitle>
            <CardDescription>{translations.account.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">{translations.account.currentPassword}</Label>
              <Input
                id="current-password"
                type="password"
                className={direction === "rtl" ? "text-right" : "text-left"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">{translations.account.newPassword}</Label>
              <Input 
                id="new-password" 
                type="password" 
                className={direction === "rtl" ? "text-right" : "text-left"} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{translations.account.confirmPassword}</Label>
              <Input
                id="confirm-password"
                type="password"
                className={direction === "rtl" ? "text-right" : "text-left"}
              />
            </div>
            <Button>{translations.account.changePassword}</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="farm" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{translations.farm.title}</CardTitle>
            <CardDescription>{translations.farm.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="farm-name">{translations.farm.farmName}</Label>
              <Input
                id="farm-name"
                defaultValue="Chenab Farms"
                className={direction === "rtl" ? "text-right" : "text-left"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farm-location">{translations.farm.farmLocation}</Label>
              <Input
                id="farm-location"
                defaultValue="123 Rural Road, Countryside"
                className={direction === "rtl" ? "text-right" : "text-left"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farm-size">{translations.farm.farmSize}</Label>
              <Input
                id="farm-size"
                defaultValue="500"
                type="number"
                className={direction === "rtl" ? "text-right" : "text-left"}
              />
            </div>
            <Button>{translations.farm.saveChanges}</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{translations.notifications.title}</CardTitle>
            <CardDescription>{translations.notifications.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">{translations.notifications.email.label}</Label>
                <p className="text-sm text-muted-foreground">
                  {translations.notifications.email.description}
                </p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">{translations.notifications.sms.label}</Label>
                <p className="text-sm text-muted-foreground">
                  {translations.notifications.sms.description}
                </p>
              </div>
              <Switch id="sms-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="health-alerts">{translations.notifications.healthAlerts.label}</Label>
                <p className="text-sm text-muted-foreground">
                  {translations.notifications.healthAlerts.description}
                </p>
              </div>
              <Switch id="health-alerts" defaultChecked />
            </div>
            <Button>{translations.notifications.saveChanges}</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}