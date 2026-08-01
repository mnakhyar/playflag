import { Link } from 'react-router-dom'

type FlowBackLinkProps = {
  to: string
  children: string
}

export function FlowBackLink({ to, children }: FlowBackLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-10 items-center text-sm font-medium text-muted transition-colors duration-200 hover:text-chalk"
    >
      ← {children}
    </Link>
  )
}
