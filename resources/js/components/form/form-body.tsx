
type FormBodyProps = {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormBody({ children, onSubmit }: FormBodyProps) {
    return (
        <div className="border rounded-b-md p-4 bg-white">
            <form className="space-y-4" onSubmit={onSubmit}>
                { children }
            </form>
        </div>
    )
}
