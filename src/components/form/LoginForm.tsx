"use client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LiaSpinnerSolid } from "react-icons/lia";

type credentialsType = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [credentials, setCredentials] = useState<credentialsType>({
    email: "admin@example.com",
    password: "admin"
  });
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleLogin = async() => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        callbackUrl: "/",
      });

      if(res?.error) {
        toast({
          variant: "destructive",
          title: "ログインに失敗しました",
          description: res.error,
        });
      };
    } catch(err) {
      toast({
        variant: "destructive",
        title: "ログインに失敗しました",
        description: `エラー詳細：${err}`,
      });
    } finally {
      setIsLoading(false);
    };
  };

  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl mx-auto">ログイン</CardTitle>
        <CardDescription className="mx-auto">ログインが必要です。</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            onChange={(e) => handleInput(e)}
            value={credentials.email}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            onChange={(e) => handleInput(e)}
            value={credentials.password}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={isLoading} className="w-full relative" onClick={handleLogin}>
          {isLoading && (
            <LiaSpinnerSolid className="mr-2 w-4 h-4 animate-spin" />
          )}
          Login
        </Button>
      </CardFooter>
    </Card>
  );
};
