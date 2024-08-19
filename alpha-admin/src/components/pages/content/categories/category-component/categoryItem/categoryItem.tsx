import React from 'react';
import { Switch, ListItem, ListItemText } from '@mui/material';
import styles from './categoryItem.module.scss';

interface CategoryItemProps {
  name: string;
  published: boolean;
  onToggle: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ name, published, onToggle }) => {
  return (
    <ListItem className={styles.list}>
      <ListItemText primary={name} />
      <Switch checked={published} onChange={onToggle} />
    </ListItem>
  );
};

export default CategoryItem;
