import React from 'react'
import PropTypes from 'prop-types'
import PlaylistModel, { sortableColumns } from './playlist_model'
import { Dropdown, Menu, MenuItem, MenuLabel, MenuSeparator } from './elements'
import { ConfirmDialog, InputDialog } from './dialogs'
import { appendArray, bindHandlers } from './utils'
import ModelBinding from './model_binding';

class PlaylistMenu extends React.PureComponent
{
    constructor(props)
    {
        super(props);

        this.state = Object.assign(this.getStateFromModel(), {
            menuOpen: false,
            removeDialogOpen: false,
            clearDialogOpen: false,
            addUrlDialogOpen: false,
            addUrlDialogValue: '',
            renameDialogOpen: false,
            renameDialogValue: '',
        });

        bindHandlers(this);
    }

    getStateFromModel()
    {
        const { currentPlaylistId, currentPlaylist } = this.props.playlistModel;

        return {
            currentPlaylistId,
            currentPlaylist: currentPlaylist || {},
        };
    }

    handleMenuToggle(value)
    {
        this.setState({ menuOpen: value });
    }

    handleAddClick(e)
    {
        e.preventDefault();
        this.props.playlistModel.addPlaylist();
    }

    handleRemoveClick(e)
    {
        e.preventDefault();
        this.setState({ removeDialogOpen: true });
    }

    handleRemoveOk()
    {
        this.setState({ removeDialogOpen: false });
        this.props.playlistModel.removePlaylist();
    }

    handleRemoveCancel()
    {
        this.setState({ removeDialogOpen: false });
    }

    handleRenameClick(e)
    {
        e.preventDefault();

        this.setState({
            renameDialogOpen: true,
            renameDialogValue: this.state.currentPlaylist.title
        });
    }

    handleRenameUpdate(value)
    {
        this.setState({ renameDialogValue: value });
    }

    handleRenameOk()
    {
        this.setState({ renameDialogOpen: false });

        const oldTitle = this.state.currentPlaylist.title;
        const newTitle = this.state.renameDialogValue;

        if (oldTitle !== newTitle)
            this.props.playlistModel.renamePlaylist(newTitle);
    }

    handleRenameCancel()
    {
        this.setState({ renameDialogOpen: false });
    }

    handleClearClick(e)
    {
        e.preventDefault();
        this.setState({ clearDialogOpen: true });
    }

    handleClearOk()
    {
        this.setState({ clearDialogOpen: false });
        this.props.playlistModel.clearPlaylist();
    }

    handleClearCancel()
    {
        this.setState({ clearDialogOpen: false });
    }

    handleAddUrlClick(e)
    {
        e.preventDefault();

        this.setState({
            addUrlDialogOpen: true,
            addUrlDialogValue: ''
        });
    }

    handleAddUrlUpdate(value)
    {
        this.setState({ addUrlDialogValue: value });
    }

    handleAddUrlOk()
    {
        this.setState({ addUrlDialogOpen: false });

        const url = this.state.addUrlDialogValue.trim();

        if (url)
            this.props.playlistModel.addItems([ url ]);
    }

    handleAddUrlCancel()
    {
        this.setState({ addUrlDialogOpen: false });
    }

    sortBy(e, index)
    {
        e.preventDefault();

        this.props.playlistModel.sortPlaylist(sortableColumns[index]);
    }

    render()
    {
        const {
            currentPlaylist,
            menuOpen,
            clearDialogOpen,
            removeDialogOpen,
            addUrlDialogOpen,
            addUrlDialogValue,
            renameDialogOpen,
            renameDialogValue,
        } = this.state;

        const menuItems = [
            <MenuItem key='add' title='Add playlist' onClick={this.handleAddClick} />,
            <MenuItem key='remove' title='Remove playlist' onClick={this.handleRemoveClick} />,
            <MenuSeparator key='modify' />,
            <MenuItem key='rename' title='Rename playlist' onClick={this.handleRenameClick} />,
            <MenuItem key='clear' title='Clear playlist' onClick={this.handleClearClick} />,
            <MenuItem key='addurl' title='Add URL' onClick={this.handleAddUrlClick} />,
            <MenuSeparator key='sort' />,
            <MenuLabel key='sortby' title='Sort by' />
        ];

        const menuSortItems = sortableColumns.map((column, index) => (
            <MenuItem
                key={'sortby' + index}
                title={column.title}
                onClick={e => this.sortBy(e, index)}
            />
        ));

        appendArray(menuItems, menuSortItems);

        const menu = (
            <Dropdown
                title='Playlist menu'
                iconName='menu'
                direction='left'
                isOpen={menuOpen}
                onRequestToggle={this.handleMenuToggle}>
                <Menu>
                    { menuItems }
                </Menu>
            </Dropdown>
        );

        const dialogs = (
            <div className='dialog-placeholder'>
                <ConfirmDialog
                    message={`Do you want to remove '${currentPlaylist.title}' playlist?`}
                    isOpen={removeDialogOpen}
                    onOk={this.handleRemoveOk}
                    onCancel={this.handleRemoveCancel} />
                <ConfirmDialog
                    message={`Do you want to clear '${currentPlaylist.title}' playlist?`}
                    isOpen={clearDialogOpen}
                    onOk={this.handleClearOk}
                    onCancel={this.handleClearCancel} />
                <InputDialog
                    message='Add URL to playlist:'
                    isOpen={addUrlDialogOpen}
                    value={addUrlDialogValue}
                    onOk={this.handleAddUrlOk}
                    onCancel={this.handleAddUrlCancel}
                    onUpdate={this.handleAddUrlUpdate} />
                <InputDialog
                    message='Enter new playlist name:'
                    isOpen={renameDialogOpen}
                    value={renameDialogValue}
                    onOk={this.handleRenameOk}
                    onCancel={this.handleRenameCancel}
                    onUpdate={this.handleRenameUpdate} />
            </div>
        );

        return (
            <div className='header-block'>
                <div className='button-bar'>
                    { menu }{ dialogs }
                </div>
            </div>
        );
    }
}

PlaylistMenu.propTypes = {
    playlistModel: PropTypes.instanceOf(PlaylistModel).isRequired
};

export default ModelBinding(PlaylistMenu, { playlistModel: 'playlistsChange' });
