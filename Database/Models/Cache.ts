import type { Optional } from 'sequelize'
import { DataTypes, Model } from 'sequelize'

import { db } from '../db' // assuming this is the correct path for your db instance

interface CacheModelAttributes {
  type: string
  cacheID: string
  keywords: Text
  data: Text
}

interface CacheModelCreationAttributes extends Optional<CacheModelAttributes, 'type' | 'cacheID' | 'keywords' | 'data'> {}

export class CacheModel extends Model<CacheModelAttributes, CacheModelCreationAttributes> implements CacheModelAttributes {
  public type!: string
  public cacheID!: string
  public keywords!: Text
  public data!: Text
}

CacheModel.init(
  {
    type: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
    cacheID: {
      type: DataTypes.STRING(),
      allowNull: false,
      unique: true,
    },
    keywords: {
      type: DataTypes.TEXT(),
      allowNull: false,
    },
    data: {
      type: DataTypes.TEXT(),
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: 'cachemodel',
  },
)
