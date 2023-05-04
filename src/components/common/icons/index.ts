import { Logo } from '@/components/common/icons/Logo';
import { UserPlus } from '@/components/common/icons/UserPlus';
import { Google } from '@/components/common/icons/Google';
import { Github } from '@/components/common/icons/Github';
import { Loader } from '@/components/common/icons/Loader';
import { Logout } from '@/components/common/icons/Logout';
import { User } from '@/components/common/icons/User';

export const Icons = {
    Logo,
    UserPlus,
    Google,
    Github,
    Loader,
    Logout,
    User,
};

export type Icon = keyof typeof Icons;
