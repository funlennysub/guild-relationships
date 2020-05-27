const { getModuleByDisplayName, React, getModule } = require('powercord/webpack');
const { Category } = require('powercord/components/settings');
const { AsyncComponent } = require('powercord/components');
const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));
const { Modal } = require('powercord/components/modal');

const { useState, useEffect } = React

module.exports = ({ }) => {


  const [friendsCategoryOpened, openFriends] = useState(false)
  const [blockedCategoryOpened, openBlocked] = useState(false)
  const [friends, setFriends] = useState([])
  const [blockedUsers, setBlocked] = useState([])

  useEffect(() => {
    async function funcName() {

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
        setFriends(friend_arr)

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
        setBlocked(blocked_arr);
    }
    funcName()
  }, [])


    return (
      <Modal className='guild-relationships-modal'>
        <Modal.Header>
          <FormTitle tag='h4'>Guild Relationships</FormTitle>
        </Modal.Header>
        <Modal.Content>
          <Category
          name="Friends"
          opened={friendsCategoryOpened}
          onChange={() => openFriends(!friendsCategoryOpened)}
          >
            <ul className="powercord-text">
              {friends}
            </ul>
          </Category>
          <Category
          name="Blocked"
          opened={blockedCategoryOpened}
          onChange={() => openBlocked(!blockedCategoryOpened)}
          >
            <ul className="powercord-text">
              {blockedUsers}
            </ul>
          </Category>
        </Modal.Content>
      </Modal>
    )


}