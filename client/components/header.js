import Link from 'next/link';

export default ({ currentuser }) => {
  // Amazing code to constructor the navigation bar
  const Links = [
    !currentuser && { label: 'Sign Up', href: '/auth/signup' },
    !currentuser && { label: 'Sign In', href: '/auth/signin' },
    currentuser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentuser && { label: 'My Orders', href: '/orders' },
    currentuser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Ticketing</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{Links}</ul>
      </div>
    </nav>
  );
};
