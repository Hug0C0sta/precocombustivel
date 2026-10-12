import DarkModeToogle from "./DarkModeToogle";
import Logo from "./Logo";

export default function NavBar() {
  return (
    <nav className="flex justify-center w-full p-4 md:py-4 shadow-xs bg-nav-bar">
      <div className="max-w-7xl w-full flex items-center justify-between">
        <Logo />
        <DarkModeToogle />
      </div>
    </nav>
  );
}
