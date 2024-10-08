import Repository from './plugins/repository.js'
import Labels from './plugins/labels.js'
import Collaborators from './plugins/collaborators.js'
import Teams from './plugins/teams.js'
import Milestones from './plugins/milestones.js'
import Branches from './plugins/branches.js'
import Environments from './plugins/environments.js'
import Rulesets from './plugins/rulesets.js'

export default class Settings {
  static sync (github, repo, config) {
    return new Settings(github, repo, config).update()
  }

  constructor (github, repo, config) {
    this.github = github
    this.repo = repo
    this.config = config
  }

  update () {
    const { branches, ...rest } = this.config

    return Promise.all(
      Object.entries(rest).map(([section, config]) => {
        return this.processSection(section, config)
      })
    ).then(() => {
      if (branches) {
        return this.processSection('branches', branches)
      }
    })
  }

  processSection (section, config) {
    const debug = { repo: this.repo }
    debug[section] = config

    const Plugin = Settings.PLUGINS[section]
    return new Plugin(this.github, this.repo, config).sync()
  }
}

Settings.FILE_NAME = '.github/settings.yml'

Settings.PLUGINS = {
  repository: Repository,
  labels: Labels,
  collaborators: Collaborators,
  teams: Teams,
  milestones: Milestones,
  branches: Branches,
  environments: Environments,
  rulesets: Rulesets
}
