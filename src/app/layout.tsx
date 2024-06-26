import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	description: 'Generated by create next app',
	title: 'Create Next App',
};

const RootLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<html lang="en">
			<body className={`${inter.className} flex place-content-center p-10`}>
				{children}
			</body>
		</html>
	);
};

export default RootLayout;
