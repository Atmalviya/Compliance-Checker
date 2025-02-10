import MFACheck from './components/MFACheck'
import RLSCheck from './components/RLSCheck'
import PITRCheck from './components/PITRCheck'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Compliance Checker</h1>
            <p className="text-muted-foreground">
              Monitor and manage your Supabase project's security compliance
            </p>
          </div>
          
          <Tabs defaultValue="mfa" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="mfa">MFA Status</TabsTrigger>
              <TabsTrigger value="rls">RLS Status</TabsTrigger>
              <TabsTrigger value="pitr">PITR Status</TabsTrigger>
            </TabsList>

            <TabsContent value="mfa">
              <Card>
                <CardHeader>
                  <CardTitle>Multi-Factor Authentication Status</CardTitle>
                  <CardDescription>Monitor MFA adoption across your user base</CardDescription>
                </CardHeader>
                <CardContent>
                  <MFACheck />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rls">
              <Card>
                <CardHeader>
                  <CardTitle>Row Level Security Status</CardTitle>
                  <CardDescription>Check RLS configuration for all tables</CardDescription>
                </CardHeader>
                <CardContent>
                  <RLSCheck />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pitr">
              <Card>
                <CardHeader>
                  <CardTitle>Point in Time Recovery Status</CardTitle>
                  <CardDescription>Verify backup and recovery settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <PITRCheck />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
