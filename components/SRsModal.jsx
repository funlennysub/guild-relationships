const { React, Flux, getModule } = require('powercord/webpack');
const { FormTitle, settings: { Category }, modal: { Modal } } = require('powercord/components');

class SRsModal extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      friends: false,
      blocked: false
    };
  }

  render () {
    return (
      <Modal className='guild-relationships-modal powercord-text'>
        <Modal.Header>
          <FormTitle tag='h4'>Guild Relationships</FormTitle>
        </Modal.Header>
        <Modal.Content>
          {[ 'friends', 'blocked' ].map(type =>
            this.props[type].length === 0
              ? <div className='grs-none'>There are no {type} in this server.</div>
              : (
                <Category
                  key={type}
                  name={type[0].toUpperCase() + type.slice(1)}
                  opened={this.state[type]}
                  onChange={() => this.setState({ [type]: !this.state[type] })}
                >
                  {this.props[type].map(user => (
                    <div
                      key={user.id}
                      className='grs-user'
                      onClick={() => getModule([ 'open', 'fetchProfile' ], false).open(user.id)}
                    >
                      <img src={user.avatarURL} alt={`${user.username}'s avatar`}/>
                      <span>{user.tag}</span>
                    </div>
                  ))}
                </Category>
              ))}
        </Modal.Content>
      </Modal>
    );
  }
}

module.exports = Flux.connectStoresAsync(
  [ getModule([ 'getRelationships' ]), getModule([ 'getCurrentUser' ]), getModule([ 'isMember' ]) ],
  ([ relationshipsStore, userStore, membersStore ], compProps) => {
    // Its safe to assume if the module aboves were found that this one is also loaded
    const userFetcher = getModule([ 'getUser' ], false);
    const relationships = relationshipsStore.getRelationships();
    const props = {
      friends: [],
      blocked: []
    };

    for (const userId in relationships) {
      if (!membersStore.isMember(compProps.guildId, userId)) {
        continue;
      }

      const relationshipType = relationships[userId];
      const user = userStore.getUser(userId);
      if (!user) {
        userFetcher.getUser(userId);
        continue;
      }
      if (relationshipType === 1) {
        props.friends.push(user);
      } else if (relationshipType === 2) {
        props.blocked.push(user);
      }
    }
    return props;
  }
)(SRsModal);
