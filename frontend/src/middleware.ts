import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const protectedPaths = ['/admin', '/store', '/customer']
  const authPaths = ['/login', '/register']
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token) {
    try {
      const decoded = jwtDecode<any>(token)
      
      if (decoded.exp * 1000 < Date.now()) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('token')
        return response
      }

      const userRole = decoded.role
      const pathname = request.nextUrl.pathname

      if (pathname.startsWith('/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      if (pathname.startsWith('/store') && userRole !== 'store') {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      if (pathname.startsWith('/customer') && userRole !== 'customer') {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      if (isAuthPath) {
        switch (userRole) {
          case 'admin':
            return NextResponse.redirect(new URL('/admin', request.url))
          case 'store':
            return NextResponse.redirect(new URL('/store', request.url))
          case 'customer':
            return NextResponse.redirect(new URL('/customer', request.url))
        }
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}