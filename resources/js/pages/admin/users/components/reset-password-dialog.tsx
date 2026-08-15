import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '@/hooks/users/use-reset-password';
import { User } from '@/types';
import { Copy, Check } from 'lucide-react';

export function ResetPasswordDialog({ user, open, onOpenChange }: { user: User | null; open: boolean; onOpenChange: (open: boolean) => void }) {
    const { mutateAsync: resetPassword, isPending } = useResetPassword(user?.id || 0);
    const [tempPassword, setTempPassword] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleReset = async () => {
        if (!user) return;
        try {
            const result = await resetPassword();
            if (result.password) {
                setTempPassword(result.password);
            }
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleClose = () => {
        setTempPassword(null);
        onOpenChange(false);
    };

    const copyToClipboard = () => {
        if (tempPassword) {
            navigator.clipboard.writeText(tempPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else onOpenChange(val); }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        {tempPassword 
                            ? `A new temporary password has been generated for ${user?.name}.` 
                            : `Are you sure you want to reset the password for ${user?.name}? A new temporary password will be generated.`}
                    </DialogDescription>
                </DialogHeader>

                {tempPassword ? (
                    <div className="flex items-center gap-2 mt-4">
                        <Input value={tempPassword} readOnly />
                        <Button variant="outline" size="icon" onClick={copyToClipboard}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                ) : (
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            They will need this password to log in. Their current session will be revoked.
                        </p>
                    </div>
                )}

                <DialogFooter>
                    {tempPassword ? (
                        <Button onClick={handleClose}>Done</Button>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleReset} disabled={isPending}>
                                {isPending ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
