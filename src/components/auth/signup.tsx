'use client'

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Icons } from "./icons";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation"

interface SignupProps extends React.HTMLAttributes<HTMLDivElement> {}

interface IUser {
  name: string,
  email: string,
  password: string
}

export default function Signup({className, ...props}: SignupProps) {
  const { toast } = useToast()
  const router = useRouter()

  const [data, setData] = useState<IUser>({name: "", email: "", password: ""})
  const [isLoading, setIsLoading] = useState<boolean>(false)


  async function onSubmit(event: React.SyntheticEvent) {    
    event.preventDefault()
    setIsLoading(true)

    const request = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",        
      },
      body: JSON.stringify(data)
    })

    const response = await request.json()

    if(!request.ok) {
      toast({ 
        title: "Ops.",
        description: response.error,
        variant: "destructive",
        action: (
          <ToastAction altText="Try again">Try again</ToastAction>
        )
      })
    } else {      
      router.push("/login")
    }

    setData({name: "", email: "", password: ""})
    setIsLoading(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((previous) => {
      return {...previous, [event.target.name]: event.target.value}
    })
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>      
      <form onSubmit={onSubmit}>
        <div className="grid gap-5">
          <div className="grid gap-1">
            <Label className="s-only" htmlFor="name">Name</Label>
            <Input 
              id="name"
              placeholder="Name"
              type="text"
              autoCapitalize="none"              
              autoCorrect="off"            
              disabled={isLoading}
              name="name"
              value={data.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <Label className="s-only" htmlFor="email">Email</Label>
            <Input 
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"            
              disabled={isLoading}
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <Label className="s-only" htmlFor="password">Password</Label>
            <Input
              id="password"      
              placeholder="password"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"        
              disabled={isLoading}
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Registrar
          </Button>
        </div>        
      </form>
    </div>
  );
}