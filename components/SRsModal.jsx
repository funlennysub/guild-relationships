const { getModuleByDisplayName, React, getModule } = require('powercord/webpack');
const { Category } = require('powercord/components/settings');
const { AsyncComponent } = require('powercord/components');
const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));

module.exports = class ListOfUsers extends React.Component {

constructor (props) {
  super(props);

  this.state = {
      settingsFirendsOpened: false,
      settingsBlockedOpened: false,
      friends: [],
      blockedUsers: []
  };
}

async componentDidMount() {

  const getUser = (await getModule(["getUser", "setFlag"])).getUser
  const getMemberIds = (await getModule(["getMemberIds"])).getMemberIds
  const isFriend = (await getModule(["isFriend"])).isFriend
  const isBlocked = (await getModule(["isFriend", "isBlocked"])).isBlocked

  const guild = getModule(['getGuildId'], false).getGuildId();

  let friendUsernames = []
		getMemberIds(guild).forEach(id => {
			if (isFriend(id)) {
				friendUsernames.push(
					getUser(id).then((user) => {
            return { friendID: `${user.id}`, friendUsername: `${user.username}#${user.discriminator}`, userAvatarURL: `${user.avatarURL}` }
          })
        )
			}
    });
  friendUsernames = await Promise.all(friendUsernames)

  const friend_arr = [];
    for (const friend of friendUsernames) {
      friend_arr.push(<div className="user-slDf"><div style={{backgroundImage: `url('${friend.userAvatarURL}')`}} className="userPfp"></div><span className="usename-jdkd">{friend.friendUsername}</span></div>);
    }
  this.setState({ friends: friend_arr })

  let blockedUsernames = []
    getMemberIds(guild).forEach(id => {
			if (isBlocked(id)) {
				blockedUsernames.push(
					getUser(id).then((b_user) => {
            return { blockedID: `${b_user.id}`, blockedUsername: `${b_user.username}#${b_user.discriminator}`, userAvatarURL: `${b_user.avatarURL}` }
          })
				)
			}
    });    

  blockedUsernames = await Promise.all(blockedUsernames)

  const blocked_arr = [];
    for (const blocked of blockedUsernames) {
      blocked_arr.push(<div className="user-slDf"><div style={{backgroundImage: `url('${blocked.userAvatarURL}')`}} className="userPfp"></div><span className="usename-jdkd">{blocked.blockedUsername}</span></div>);
    }
  this.setState({ blockedUsers: blocked_arr });
}

  render() {

    return (
      <div className="sizeMedium-df47zS">
        <FormTitle tag="h4" className="formTitle-LdsDK">Guild Relationships</FormTitle>
        <Category
        name="Friends"
        opened={this.state.settingsFirendsOpened}
        onChange={() => this.setState({ settingsFirendsOpened: !this.state.settingsFirendsOpened })}
        >
        <ul className="powercord-text">
          {this.state.friends}
        </ul>
        </Category>
        <Category
        name="Blocked"
        opened={this.state.settingsBlockedOpened}
        onChange={() => this.setState({ settingsBlockedOpened: !this.state.settingsBlockedOpened })}
        >
        <ul className="powercord-text">
          {this.state.blockedUsers}
        </ul>
        </Category>
      </div>
    )
  }

}
