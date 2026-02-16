import Link from "next/link";

interface SpecialLinkTheme {
	iconColor: string;
	iconBG: string;
	bg: string;
	light: boolean;
}

interface SpecialLinkProps {
	icon: any;
	text: string;
	link: string;
	theme: SpecialLinkTheme;
}

export const SpecialLink = ({
	icon,
	text,
	link,
	theme = {
		iconColor: "text-gray-300",
		iconBG: "bg-gray-500",
		bg: "bg-gray-300",
		light: false,
	},
}: SpecialLinkProps) => {
	const Icon = icon;

	return (
        <Link
            href={`/${link}` || "#"}
            className={`relative flex items-center justify-start group`}>
            {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
            }
            <div
				className={`group-hover:brightness-[95%] transition-all duration-300 w-full h-70 rounded-lg ${theme.bg}`}
			></div>
            <div className="absolute top-2/4 -translate-y-2/4 flex gap-x-3 items-center px-2">
				<div
					className={`p-2 rounded-lg flex justify-center items-center ${theme.iconBG}`}
				>
					<Icon className={`text-4xl ${theme.iconColor}`} />
				</div>

				<p
					className={`text-sm font-medium ${theme.light ? "text-white" : "text-secondary-text"
						}`}
				>
					{text}
				</p>
			</div>
        </Link>
    );
};
