import React from 'react';

import Autocomplete from 'react-autocomplete';

class Search extends React.Component {
    render() {
        return (
            <div className="search">
                <Autocomplete
                    value={this.props.autoCompleteValue}
                    items={this.props.tracks}
                    getItemValue={(item) => item.title}
                    onSelect={this.props.handleSelect}
                    onChange={this.props.handleChange}
                    renderItem={this.handleRenderItem.bind(this)}
                />
            </div>
        );
    }
    handleRenderItem(item, isHighlighted) {
        const listStyles = {
            item: {
                padding: '2px 6px',
                cursor: 'default'
            },
            highlightedItem: {
                padding: '2px 6px',
                cursor: 'default',
                color: 'white',
                background: '#F38B72'
            }
        };
        return (
            <div
            style={isHighlighted ? listStyles.highlightedItem : listStyles.item}
            key={item.id}
        id={item.id}
        >{item.title}</div>
        );
    }
}

export default Search;
