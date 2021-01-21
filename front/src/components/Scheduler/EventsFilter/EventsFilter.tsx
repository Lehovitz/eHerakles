import {
    Button,
    ButtonGroup,
    Hidden,
    MenuItem,
    Select,
} from "@material-ui/core";
import React from "react";
import styles from "./EventsFilter.module.scss";

type EventsFilterProps = {
    selectedFilter: string;
    changeFilter: (filter: string) => void;
};

const filters = ["All", "My events", "Recommended"];

export default ({ selectedFilter, changeFilter }: EventsFilterProps) => {
    const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) =>
        changeFilter(e.target.value as string);

    return (
        <div className={styles.container}>
            <Hidden xsDown>
                <ButtonGroup>
                    {filters.map((filter) => (
                        <Button
                            key={filter}
                            color={
                                filter === selectedFilter
                                    ? "primary"
                                    : "default"
                            }
                            onClick={() => changeFilter(filter)}
                        >
                            {filter}
                        </Button>
                    ))}
                </ButtonGroup>
            </Hidden>
            <Hidden smUp>
                <Select
                    className="filterSelectButton"
                    value={selectedFilter}
                    onChange={handleSelectChange}
                    variant="outlined"
                >
                    {filters.map((filter) => (
                        <MenuItem key={filter} value={filter}>
                            {filter}
                        </MenuItem>
                    ))}
                </Select>
            </Hidden>
        </div>
    );
};
