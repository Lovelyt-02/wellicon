import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
    return (
        <Sonner
            position="top-right"
            richColors
            closeButton
            {...props}
        />
    );
};

export { Toaster };