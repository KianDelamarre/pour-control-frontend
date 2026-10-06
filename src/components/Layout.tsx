import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

export function Layout() {
    return (
        <>
            <Navbar />
            <main style={{ padding: '2rem' }}>
                <Outlet />
            </main>
        </>
    );
}