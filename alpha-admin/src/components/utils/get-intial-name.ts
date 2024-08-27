export const getInitials = (name: string) => {
    if (!name) return '';
    const words = name.split(' ');
    let initials = words[0] ? words[0][0] : '';
    if (words.length > 1 && words[1]) {
        initials += words[1][0];
    }
    return initials.toUpperCase();
};
