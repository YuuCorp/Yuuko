import type { Optional } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

import { db } from '../db' // assuming this is the correct path for your db instance

interface AnnouncementModelAttributes {
  date: Date
  announcement: string
}

interface AnnouncementModelCreationAttributes extends Optional<AnnouncementModelAttributes, 'date' | 'announcement'> {}

export class AnnouncementModel extends Model<AnnouncementModelAttributes, AnnouncementModelCreationAttributes> implements AnnouncementModelAttributes {
  public date!: Date
  public announcement!: string
}

AnnouncementModel.init(
  {
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: false,
    },
    announcement: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: false,
    },
  },
  {
    sequelize: db,
    tableName: 'announcementmodel',
  },
)
