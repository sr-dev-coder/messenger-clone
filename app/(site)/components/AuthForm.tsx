'use client'
import axios from "axios";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitErrorHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<variant>('LOGIN');
  const [loading, setLoading] = useState(false);

  useEffect(() =>{
    if(session?.status === 'authenticated'){
        console.log('authenticated')
        router.push('/users')
    }
  }, [session?.status, router])

  const toggleVariant = useCallback(() => {
    if(variant === 'LOGIN'){
        setVariant('REGISTER')
    }else {
        setVariant('LOGIN')
    }
  }, [variant]);

  const { register, handleSubmit, formState:{ errors }} = useForm<FieldValues>({
    defaultValues: {
        name: '',
        email: '',
        password: ''
    }
  })

  const onSubmit: SubmitErrorHandler<FieldValues> = (data) => {
    setLoading(true);
    if(variant === 'REGISTER'){
        //Axios Register
        axios.post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setLoading(false))
    }
    if(variant === 'LOGIN'){
        //Axios Login
        signIn('credentials', {
            ...data,
            redirect: false
        })
        .then((callback) => {
            if(callback?.error){
                toast.error('Invalid credentials')
            }
            if(callback?.ok && !callback?.error){
                toast.success('logged in!')
                router.push('/users')
            }
        })
        .finally(() => setLoading(false))
    }
  }
  
const socialAction = (action: string) => {
    setLoading(true);
    signIn(action, { redirect: false})
    .then((callback) => {
        if(callback?.error){
            toast.error('Invalid credentials')
        }
        if(callback?.ok && !callback?.error){
            toast.success('logged in!')
            router.push('/users')
        }
    })
    .finally(() => setLoading(false))
}

  return (
    <div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
    >
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <form
                className="space-y-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                {
                    variant === 'REGISTER' && (
                        <Input 
                            id="name"
                            label="Name" 
                            register={register} 
                            errors={errors}
                         />
                    )
                }
                <Input 
                    id="email"
                    label="Email Address"
                    type="email" 
                    register={register} 
                    errors={errors}
                />
                <Input 
                    id="password"
                    label="Password"
                    type="password" 
                    register={register} 
                    errors={errors}
                />
                <div>
                    <Button
                        fullWidth
                        disabled={loading}
                        type="submit"
                    >
                         {variant === 'LOGIN' ? 'Sign In' : 'Register'}  
                    </Button>
                </div>
            </form>    
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">or continue with</span>
                    </div>
                </div>
                <div className="mt-6 flex gap-2">
                    <AuthSocialButton 
                        Icon={BsGithub} 
                        onClick={() => socialAction('github')}
                     />
                     <AuthSocialButton 
                        Icon={BsGoogle} 
                        onClick={() => socialAction('google')}
                     />
                </div>
            </div>
            <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                <div>
                    {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account'}
                </div>
                <div onClick={toggleVariant} className="underline cursor-pointer">
                    {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                </div>
            </div>
        </div>
    </div>
  )
}

export default AuthForm